import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MousePointerClick } from "lucide-react";
import Layout from "../../components/layout";
import Header from "../../components/header";
import { VIEWS_OBJECT, type ViewType } from "../../types";

function RecipeEdit({
  onViewChange,
}: {
  onViewChange: (view: ViewType) => void;
}) {
  const [steps, setSteps] = useState<any[]>([]);
  return (
    <Layout>
      <Header
        title="Edit Recipe"
        rightButton={
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() => onViewChange(VIEWS_OBJECT.RECIPE_LIST)}
          >
            Back to List
          </Button>
        }
      />
      {/* 내부 스크롤을 위한 Shadcn UI ScrollArea 활용 */}
      <ScrollArea className="flex-1 h-full">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              onClick={() => onViewChange(VIEWS_OBJECT.RECIPE_DETAIL)}
            >
              Recorded Steps
            </h2>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-mono">
              steps
            </span>
          </div>

          {/* 실제 스텝이 들어가는 공간 */}
          {steps.length === 0 ? (
            <>
              <div className="border-2 border-dashed rounded-xl h-60 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-muted rounded-full p-3 mb-3">
                  <MousePointerClick className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No steps recorded</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click elements on the web page to start capturing data.
                </p>
                <Button className="mt-3 cursor-pointer">Create Step</Button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              {/* 5년차 개발자의 짬으로 나중에 여기에 map()으로 Card를 렌더링하세요 */}
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="p-3 border rounded-lg bg-card shadow-sm h-20"
                >
                  Step {i + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </Layout>
  );
}

export default RecipeEdit;
