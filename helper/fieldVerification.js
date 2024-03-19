
export const isValidPhoneNumber = (number) => {
  const regex =/^\d{11}$/;
  return regex.test(number);
};


export function isValidCarModel(value) {
  return /.{3,}$/.test(value?.trim());
}


