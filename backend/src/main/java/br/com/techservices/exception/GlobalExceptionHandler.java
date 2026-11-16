package br.com.techservices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Padroniza as respostas de erro da API no formato:
 * { "timestamp", "status", "erro", "mensagem", "campos" }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    public record ErroResponse(OffsetDateTime timestamp, int status, String erro, String mensagem,
                               Map<String, String> campos) {
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErroResponse> tratarApi(ApiException ex) {
        return montar(ex.getStatus(), ex.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> tratarValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> campos.putIfAbsent(e.getField(), e.getDefaultMessage()));
        return montar(HttpStatus.BAD_REQUEST, "Dados inválidos. Verifique os campos informados.", campos);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErroResponse> tratarValidacaoMetodo(HandlerMethodValidationException ex) {
        return montar(HttpStatus.BAD_REQUEST, "Dados inválidos. Verifique os campos informados.", null);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponse> tratarJsonInvalido(HttpMessageNotReadableException ex) {
        return montar(HttpStatus.BAD_REQUEST, "Corpo da requisição ausente ou em formato inválido.", null);
    }

    private ResponseEntity<ErroResponse> montar(HttpStatus status, String mensagem, Map<String, String> campos) {
        ErroResponse corpo = new ErroResponse(OffsetDateTime.now(), status.value(),
                status.getReasonPhrase(), mensagem, campos);
        return ResponseEntity.status(status).body(corpo);
    }
}
