import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export const ValidateDto = async (
  dto: unknown,
  validatorClass: ClassConstructor<unknown>
) => {
  const validationObject = plainToInstance(validatorClass, dto);
  const errors = await validate(validationObject as object);
  if (errors.length > 0) {
    return errors;
  }
  return null;
};
