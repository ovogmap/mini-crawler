import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Play } from "lucide-react";
import { VIEWS_OBJECT, type ViewType } from "../../types";
import Layout from "../../components/layout";
import Header from "../../components/header";
function RecipeDetail({
  onViewChange,
}: {
  onViewChange: (view: ViewType) => void;
}) {
  return (
    <Layout>
      <Header
        title="Recipe Detail"
        backButton={
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => onViewChange(VIEWS_OBJECT.RECIPE_LIST)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
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
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-muted-foreground mb-2">
                TARGET URL
              </h3>
              <p className="text-sm break-all bg-muted p-2 rounded leading-relaxed font-mono text-[11px]">
                Url
              </p>
            </section>

            <section>
              <h3 className="text-xs font-bold text-muted-foreground mb-2">
                STRUCTURE
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary"># collector</Badge>
              </div>
            </section>
          </div>
        </ScrollArea>
      </main>

      <footer className="p-4 border-t bg-card space-y-2">
        <Button className="w-full py-6" size="lg">
          <Play className="w-4 h-4 mr-2" /> Run Scraper
        </Button>
      </footer>
    </Layout>
  );
}

export default RecipeDetail;
