import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

function EditCard({
  i,
  remove,
}: {
  i: number;
  remove: (i: number) => void;
}) {
  const { control, register, watch, setValue } = useFormContext();
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Selector 선택 모드 토글
  const handleToggleSelectMode = async () => {
    try {
      // 현재 활성화된 탭 가져오기 (사용자가 보고 있는 탭)
      const [activeTab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      // 활성 탭이 웹 페이지인지 확인
      if (
        !activeTab ||
        !activeTab.id ||
        !activeTab.url ||
        activeTab.url.startsWith("chrome://") ||
        activeTab.url.startsWith("chrome-extension://") ||
        activeTab.url.startsWith("edge://") ||
        activeTab.url.startsWith("about:")
      ) {
        alert("현재 탭이 웹 페이지가 아닙니다. 웹 페이지 탭으로 전환한 후 다시 시도해주세요.");
        return;
      }

      // Content script에 선택 모드 토글 메시지 전송 (카드 인덱스 포함)
      const response = await browser.tabs.sendMessage(activeTab.id, {
        type: "TOGGLE_SELECT_MODE",
        cardIndex: i, // 현재 카드의 인덱스 전달
      });

      // 상태 업데이트
      if (response && typeof response.isActive === "boolean") {
        setIsSelectMode(response.isActive);
      }
    } catch (error) {
      // Content script가 로드되지 않은 경우
      if (
        error instanceof Error &&
        error.message.includes("Could not establish connection")
      ) {
        alert(
          "페이지를 새로고침한 후 다시 시도해주세요.\n\n확장 프로그램을 다시 로드한 경우, 웹 페이지도 새로고침해야 합니다."
        );
      } else {
        alert(`오류가 발생했습니다: ${error}`);
      }
    }
  };

  // 메시지 리스너 등록
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "SELECTOR_SELECTED") {
        // 이 카드의 인덱스와 메시지의 cardIndex가 일치할 때만 처리
        if (message.cardIndex === i) {
          // Selector를 form에 자동 입력
          setValue(`steps.${i}.selector`, message.selector);
          // 선택 완료 후 모드 종료
          setIsSelectMode(false);
        }
      } else if (message.type === "SELECTOR_MODE_CHANGED") {
        // 이 카드의 인덱스와 메시지의 cardIndex가 일치할 때만 처리
        if (message.cardIndex === i) {
          // 선택 모드 상태 변경 (ESC 등으로 종료된 경우)
          setIsSelectMode(message.isActive);
        }
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [i, setValue]);
  
  return (
    <div className="p-3 border rounded-lg bg-card shadow-sm flex flex-col gap-2 align-start justify-start">
      <div className="w-full flex-col flex justify-start items-start gap-3">
        <div className="w-full flex justify-between  gap-2">
          <Field>
            <FieldLabel>action</FieldLabel>
            <Controller
              name={`steps.${i}.action`}
              control={control}
              render={({ field: controllerField }) => (
                <RadioGroup
                  value={controllerField.value}
                  onValueChange={controllerField.onChange}
                  className="w-fit flex gap-3"
                >
                  <div className="flex items-center gap-1">
                    <RadioGroupItem value="click" id={`click.${i}.action`} />
                    <Label htmlFor={`click.${i}.action`}>이동</Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroupItem
                      value="extract"
                      id={`extract.${i}.action`}
                    />
                    <Label htmlFor={`extract.${i}.action`}>추출</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </Field>
          <Button
            variant="ghost"
            className="w-8 h-8 cursor-pointer"
            size="icon"
            onClick={() => remove(i)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <Field {...register(`steps.${i}.selector`)}>
          <FieldLabel htmlFor={`steps.${i}.selector`}>selector</FieldLabel>
          <div className="w-full flex justify-between items-center gap-2">
            <Input
              {...register(`steps.${i}.selector`)}
              id={`steps.${i}.selector`}
              type="text"
              readOnly
              placeholder="오른쪽 버튼을 눌러 selector를 복사해주세요."
              className="text-xs"
            />
            <Button
              className="cursor-pointer"
              size="icon"
              onClick={handleToggleSelectMode}
              type="button"
              variant={isSelectMode ? "default" : "outline"}
            >
              <Copy
                className={`w-4 h-4 ${isSelectMode ? "animate-pulse" : ""}`}
              />
            </Button>
          </div>
        </Field>
        {watch(`steps.${i}.action`) === "extract" && (
          <Field {...register(`steps.${i}.label`)}>
            <FieldLabel htmlFor={`steps.${i}.label`}>label</FieldLabel>
            <Input
              {...register(`steps.${i}.label`)}
              id={`steps.${i}.label`}
              type="text"
              placeholder="추출할 데이터의 제목을 입력해주세요."
              className="text-xs"
            />
          </Field>
        )}
        <Field {...register(`steps.${i}.description`)}>
          <FieldLabel htmlFor={`steps.${i}.description`}>
            description
          </FieldLabel>
          <Input
            {...register(`steps.${i}.description`)}
            id={`steps.${i}.description`}
            type="text"
            placeholder="해당 스텝의 설명을 입력해주세요."
            className="text-xs"
          />
        </Field>
      </div>
    </div>
  );
}

export default EditCard;
