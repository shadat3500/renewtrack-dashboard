import { UserX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export function NotFoundCustomer() {
  return (
    <Card className="mt-6">
      <EmptyState
        icon={<UserX className="size-7" />}
        title="Customer not found"
        message="This customer may have been deleted."
        action={<ButtonLink href="/customers">Back to customers</ButtonLink>}
      />
    </Card>
  );
}
