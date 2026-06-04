import { redirect } from "next/navigation";

export default function NewProductPage() {
  redirect("/shop/dashboard/products");
}
