import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MousePointerClick } from "lucide-react";
import Layout from "../../components/layout";
import Header from "../../components/header";
import { VIEWS_OBJECT, type Step, type ViewType } from "../../types";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import EditCard from "./components/EditCard";

function RecipeEdit({
  onViewChange,
}: {
  onViewChange: (view: ViewType) => void;
}) {
  const form = useForm<{ steps: Step[] }>({
    defaultValues: { steps: [] },
  });
  const { control, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  console.log(watch("steps"));
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
      <main className="flex-1 flex flex-col min-h-0">
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

            {fields.length === 0 ? (
              <>
                <div className="border-2 border-dashed rounded-xl h-60 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-muted rounded-full p-3 mb-3">
                    <MousePointerClick className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No steps recorded</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click elements on the web page to start capturing data.
                  </p>
                  <Button
                    className="mt-3 cursor-pointer"
                    onClick={() =>
                      append({ id: "", action: "click", selector: "" })
                    }
                  >
                    Create Step
                  </Button>
                </div>
              </>
            ) : (
              <FormProvider {...form}>
                <div className="space-y-2">
                  {fields.map((field, i) => (
                    <EditCard field={field} i={i} remove={remove} />
                  ))}
                  <Button
                    className="mt-3 cursor-pointer"
                    onClick={() =>
                      append({ id: "", action: "click", selector: "" })
                    }
                  >
                    Create Step
                  </Button>
                </div>
              </FormProvider>
            )}
          </div>
        </ScrollArea>
      </main>
    </Layout>
  );
}

export default RecipeEdit;
