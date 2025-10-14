import ViewProtagonista from "./ViewProtagonista";
import { getBeneficiario } from "@/lib/api";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getBeneficiario(id);

  return <ViewProtagonista id={id} initialData={data} />;
}