import { Card, CardContent } from "@/components/ui/card";
import { RoutineStep } from "@/store/useAppStore";
import { AlertCircle } from "lucide-react";

type RoutineCardProps = {
  step: RoutineStep;
};

export default function RoutineCard({ step }: RoutineCardProps) {
  return (
    <Card className="border-2 border-gray-100 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-bold text-white shadow-md">
            {step.order}
          </span>
          <div className="space-y-2 flex-1">
            <h4 className="font-bold text-base text-gray-800">{step.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{step.details}</p>
            {step.warning && (
              <div className="flex items-start gap-2 mt-3 p-3 bg-amber-50 border-2 border-amber-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">{step.warning}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}