import { Query } from "@aws-sdk/client-textract";
import {
  venezuelanIdQueries,
  venezuelanCirculationCertificateQueries,
  InvoiceQueries,
  RifQueries,
} from "../constants/documentQueries";

interface returnType {
  [key: string]: Query[];
}

export default function getDocumentQueries(type: string): Query[] | undefined {
  const types: returnType = {
    ci: venezuelanIdQueries,
    cc: venezuelanCirculationCertificateQueries,
    inv: InvoiceQueries,
    rif: RifQueries,
  };

  return types[type] ?? undefined;
}
