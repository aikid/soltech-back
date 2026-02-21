import { z } from 'zod'


export type CreateUserBodySchema = z.infer<typeof createUserBodySchema>
export type UpdateUserSchema = z.infer<typeof updateUserSchema>

export const createUserBodySchema = z.object({
  name: z.string().min(1, "O nome não pode ser vazio").max(50, "O nome esta muito longo"),
  email: z.string().email("E-mail inválido. Informe um endereço válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  phone: z.string().min(11, "O telefone é obrigatório."),
  cpf: z.string().min(11, "O CPF é obrigatório."),
  confirmPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
});

const updateUserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(15, "Name too long"),
});