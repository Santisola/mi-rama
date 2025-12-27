import ViewProtagonista from "./ViewProtagonista";
import { getAllLegajos, getBeneficiario } from "@/lib/api";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getBeneficiario(id);
  const allLegajos = await getAllLegajos();

  return <ViewProtagonista id={id} initialData={data} allLegajos={allLegajos} />;
}