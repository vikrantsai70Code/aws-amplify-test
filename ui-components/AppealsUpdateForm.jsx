/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getAppeals } from "./graphql/queries";
import { updateAppeals } from "./graphql/mutations";
const client = generateClient();
export default function AppealsUpdateForm(props) {
  const {
    id: idProp,
    appeals: appealsModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    appealId: "",
    fafsaId: "",
    appealReasons: "",
    supportingDocuments: "",
  };
  const [appealId, setAppealId] = React.useState(initialValues.appealId);
  const [fafsaId, setFafsaId] = React.useState(initialValues.fafsaId);
  const [appealReasons, setAppealReasons] = React.useState(
    initialValues.appealReasons
  );
  const [supportingDocuments, setSupportingDocuments] = React.useState(
    initialValues.supportingDocuments
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = appealsRecord
      ? { ...initialValues, ...appealsRecord }
      : initialValues;
    setAppealId(cleanValues.appealId);
    setFafsaId(cleanValues.fafsaId);
    setAppealReasons(cleanValues.appealReasons);
    setSupportingDocuments(cleanValues.supportingDocuments);
    setErrors({});
  };
  const [appealsRecord, setAppealsRecord] = React.useState(appealsModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getAppeals.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getAppeals
        : appealsModelProp;
      setAppealsRecord(record);
    };
    queryData();
  }, [idProp, appealsModelProp]);
  React.useEffect(resetStateValues, [appealsRecord]);
  const validations = {
    appealId: [],
    fafsaId: [],
    appealReasons: [],
    supportingDocuments: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          appealId: appealId ?? null,
          fafsaId: fafsaId ?? null,
          appealReasons: appealReasons ?? null,
          supportingDocuments: supportingDocuments ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateAppeals.replaceAll("__typename", ""),
            variables: {
              input: {
                id: appealsRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "AppealsUpdateForm")}
      {...rest}
    >
      <TextField
        label="Appeal id"
        isRequired={false}
        isReadOnly={false}
        value={appealId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              appealId: value,
              fafsaId,
              appealReasons,
              supportingDocuments,
            };
            const result = onChange(modelFields);
            value = result?.appealId ?? value;
          }
          if (errors.appealId?.hasError) {
            runValidationTasks("appealId", value);
          }
          setAppealId(value);
        }}
        onBlur={() => runValidationTasks("appealId", appealId)}
        errorMessage={errors.appealId?.errorMessage}
        hasError={errors.appealId?.hasError}
        {...getOverrideProps(overrides, "appealId")}
      ></TextField>
      <TextField
        label="Fafsa id"
        isRequired={false}
        isReadOnly={false}
        value={fafsaId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              appealId,
              fafsaId: value,
              appealReasons,
              supportingDocuments,
            };
            const result = onChange(modelFields);
            value = result?.fafsaId ?? value;
          }
          if (errors.fafsaId?.hasError) {
            runValidationTasks("fafsaId", value);
          }
          setFafsaId(value);
        }}
        onBlur={() => runValidationTasks("fafsaId", fafsaId)}
        errorMessage={errors.fafsaId?.errorMessage}
        hasError={errors.fafsaId?.hasError}
        {...getOverrideProps(overrides, "fafsaId")}
      ></TextField>
      <TextField
        label="Appeal reasons"
        isRequired={false}
        isReadOnly={false}
        value={appealReasons}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              appealId,
              fafsaId,
              appealReasons: value,
              supportingDocuments,
            };
            const result = onChange(modelFields);
            value = result?.appealReasons ?? value;
          }
          if (errors.appealReasons?.hasError) {
            runValidationTasks("appealReasons", value);
          }
          setAppealReasons(value);
        }}
        onBlur={() => runValidationTasks("appealReasons", appealReasons)}
        errorMessage={errors.appealReasons?.errorMessage}
        hasError={errors.appealReasons?.hasError}
        {...getOverrideProps(overrides, "appealReasons")}
      ></TextField>
      <TextField
        label="Supporting documents"
        isRequired={false}
        isReadOnly={false}
        value={supportingDocuments}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              appealId,
              fafsaId,
              appealReasons,
              supportingDocuments: value,
            };
            const result = onChange(modelFields);
            value = result?.supportingDocuments ?? value;
          }
          if (errors.supportingDocuments?.hasError) {
            runValidationTasks("supportingDocuments", value);
          }
          setSupportingDocuments(value);
        }}
        onBlur={() =>
          runValidationTasks("supportingDocuments", supportingDocuments)
        }
        errorMessage={errors.supportingDocuments?.errorMessage}
        hasError={errors.supportingDocuments?.hasError}
        {...getOverrideProps(overrides, "supportingDocuments")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || appealsModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || appealsModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}