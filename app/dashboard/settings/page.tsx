import { getProductos } from "@/app/actions/products";
import SettingForm from "@/components/settings/setting-form";

export default async function SettingsPage() {
  const result = await getProductos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SettingForm />
      </div>
    </div>
  );
}
