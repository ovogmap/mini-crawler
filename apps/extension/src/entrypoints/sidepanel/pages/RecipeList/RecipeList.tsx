import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, MousePointerClick } from "lucide-react";
import Header from "../../components/header";
import { VIEWS_OBJECT, type ViewType } from "../../types";
import Layout from "../../components/layout";

function RecipeList({
  onViewChange,
}: {
  onViewChange: (view: ViewType) => void;
}) {
  const [recipes, setRecipes] = useState<any[]>([]);
  return (
    <Layout>
      <Header
        title="My Recipes"
        rightButton={
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() => onViewChange(VIEWS_OBJECT.RECIPE_EDIT)}
          >
            Create Recipe
          </Button>
        }
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {recipes.length === 0 ? (
            <div className="border-2 border-dashed rounded-xl h-60 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-muted rounded-full p-3 mb-3">
                <MousePointerClick className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No recipes found</p>
            </div>
          ) : (
            <>
              {recipes.map((i) => (
                <Card
                  key={i}
                  className="hover:border-primary cursor-pointer transition-colors"
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">Ninehire 수집 {i}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated: 2026.01.31
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </Layout>
  );
}

export default RecipeList;
