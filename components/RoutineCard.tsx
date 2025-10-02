import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoutineStep } from "@/store/useAppStore";
import { Sun, Moon } from "lucide-react";

type RoutineCardProps = {
  time: "morning" | "evening";
  steps: RoutineStep[];
};

export default function RoutineCard({ time, steps }: RoutineCardProps) {
  const timeLabel = time === "morning" ? "Matin" : "Soir";
  const Icon = time === "morning" ? Sun : Moon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {timeLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step) => (
          <div key={`${step.time}-${step.order}`} className="space-y-1">
            <div className="flex items-start gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {step.order}
              </span>
              <div className="space-y-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.details}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}