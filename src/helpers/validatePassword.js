export default function validatePassword(senha) {
  const comprimentoMinimo = /.{8,}/;
  const letraMaiuscula = /[A-Z]/;
  const letraMinuscula = /[a-z]/;
  const numero = /[0-9]/;
  const caractereEspecial = /[!@#$%^&*(),.?":{}|<>]/;

  if (!comprimentoMinimo.test(senha)) {
    return {
      isValid: false,
      message: "A senha deve ter no mínimo 8 caracteres.",
    };
  }
  if (!letraMaiuscula.test(senha)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos uma letra maiúscula.",
    };
  }
  if (!letraMinuscula.test(senha)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos uma letra minúscula.",
    };
  }
  if (!numero.test(senha)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos um número.",
    };
  }
  if (!caractereEspecial.test(senha)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos um caractere especial.",
    };
  }

  return { isValid: true, message: "Sucesso." };
}
