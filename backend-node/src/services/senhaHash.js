import bcrypt from "bcryptjs";

// Mesmo custo padrão do BCryptPasswordEncoder do Spring (strength 10).
// bcryptjs gera hashes "$2a$", que o Spring lê, e lê os "$2a$" que o Spring gera —
// um cliente cadastrado por um backend consegue logar pelo outro.
const CUSTO = 10;

export const gerarHash = (senha) => bcrypt.hash(senha, CUSTO);
export const conferir = (senha, hash) => bcrypt.compare(senha, hash);
