import { ExpensetypesValues } from "../constants/keyValues";
const expenseTypeFormatter = (type: string) => {
  return ExpensetypesValues[type] || type;
};

export default expenseTypeFormatter;
