import { useState, useMemo } from "react";
import RecipeList from "./pages/RecipeList/RecipeList";
import RecipeEdit from "./pages/RecipeEdit/RecipeEdit";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import { VIEWS_OBJECT, type ViewType } from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>(
    VIEWS_OBJECT.RECIPE_LIST
  );
  const [steps, setSteps] = useState<any[]>([]); // 스크래핑 단계들

  const onViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const currentViewComponent = useMemo(() => {
    switch (currentView) {
      case VIEWS_OBJECT.RECIPE_LIST:
        return <RecipeList onViewChange={onViewChange} />;
      case VIEWS_OBJECT.RECIPE_EDIT:
        return <RecipeEdit onViewChange={onViewChange} />;
      case VIEWS_OBJECT.RECIPE_DETAIL:
        return <RecipeDetail onViewChange={onViewChange} />;
      default:
        return <RecipeList onViewChange={onViewChange} />;
    }
  }, [currentView]);

  return <>{currentViewComponent}</>;
}

//  // 전체 컨테이너: h-screen(화면 꽉 채움), flex-col(세로 배치)
//  <div className="flex flex-col h-screen bg-background border-l shadow-2xl">
//  {/* [1] 확실한 헤더 영역: 고정 높이(h-16), shrink-0(줄어들지 않음) */}
//  <header className="h-16 shrink-0 flex items-center justify-between px-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
//    <div className="flex items-center gap-2">
//      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//        <MousePointerClick className="w-5 h-5 text-primary-foreground" />
//      </div>
//      <span className="font-bold tracking-tight">mini-crawler v0.1</span>
//    </div>
//    <Button variant="ghost" size="icon" className="rounded-full">
//      <Settings className="w-4 h-4" />
//    </Button>
//  </header>

//  {/* [2] 컨텐츠 영역: flex-1(남은 공간 모두 차지), overflow-hidden */}
//  <main className="flex-1 flex flex-col min-h-0">
//    {currentViewComponent}
//  </main>

//  {/* [3] 하단 푸터 영역: border-t로 구분, px-4 py-4로 여백 확보 */}
//  {currentView === Views.RECIPE_DETAIL && (
//    <footer className="shrink-0 p-4 border-t bg-card/80 backdrop-blur-sm space-y-3">
//      <Button
//        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg py-6"
//        size="lg"
//      >
//        <Save className="w-4 h-4 mr-2" />
//        Generate Recipe JSON
//      </Button>
//    </footer>
//  )}
// </div>
