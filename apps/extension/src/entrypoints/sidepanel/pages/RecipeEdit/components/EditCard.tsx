import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { Controller, useFormContext } from "react-hook-form";
import type { Step } from "@/entrypoints/sidepanel/types";

function EditCard({
  field,
  i,
  remove,
}: {
  field: Step;
  i: number;
  remove: (i: number) => void;
}) {
  const { control, register, watch } = useFormContext();
  return (
    <div
      key={field.id}
      className="p-3 border rounded-lg bg-card shadow-sm flex flex-col gap-2 align-start justify-start"
    >
      <div className="w-full flex-col flex justify-start items-start gap-3">
        <div className="w-full flex justify-between  gap-2">
          <Field>
            <FieldLabel>action</FieldLabel>
            <Controller
              name={`steps.${i}.action`}
              control={control}
              defaultValue={field.action}
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
            <Button className="cursor-pointer" size="icon">
              <Copy className="w-4 h-4" />
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
