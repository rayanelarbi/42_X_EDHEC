import { Card, CardContent } from "@/components/ui/card";
import { RoutineStep } from "@/store/useAppStore";
import { AlertCircle } from "lucide-react";

type RoutineCardProps = {
  step: RoutineStep;
};

export default function RoutineCard({ step }: RoutineCardProps) {
  return (
    <Card className="border border-gray-200 hover:shadow-sm transition-all duration-200 bg-white">
      <CardContent className="pt-5">
        <div className="flex items-start gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0065B7] text-xs font-bold text-white">
            {step.order}
          </span>
          <div className="space-y-2 flex-1">
            <h4 className="font-bold text-base text-gray-900">{step.title}</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{step.details}</p>
            {step.warning && (
              <div className="flex items-start gap-2 mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
                <AlertCircle className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800">{step.warning}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}