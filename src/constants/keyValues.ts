const maxPercentTolerant = 80;

interface returnInt {
  [key: string]: string;
}

const ExpensetypesValues: returnInt = {
  ITEM: "Producto",
  QUANTITY: "Cantidad",
  UNIT_PRICE: "Precio unitario",
  PRICE: "Precio",
  PRODUCT_CODE: "Código",
  OTHER: "Otro",
  EXPENSE_ROW: "Promedio",
};

export { maxPercentTolerant, ExpensetypesValues };
