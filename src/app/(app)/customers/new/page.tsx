import { CustomerForm } from "@/components/customers/customer-form";
import { PageHeader } from "@/components/layout/page-header";

export default function NewCustomerPage() {
  return (
    <>
      <PageHeader
        back={{ href: "/customers", label: "Customers" }}
        title="Add Customer"
        subtitle="Save a customer and their subscription. The expiry date is worked out for you."
      />
      <CustomerForm />
    </>
  );
}
