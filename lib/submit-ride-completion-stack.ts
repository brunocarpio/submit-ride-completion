import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { Stack, StackProps } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class SubmitRideCompletionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const managementFunction = new Function(this, "Rides-Processor", {
      runtime: Runtime.NODEJS_18_X,
      handler: "rides-processor.handler",
      code: Code.fromAsset("functions"),
    });

    const ridesIntegration = new HttpLambdaIntegration(
      "Rides-Management-Integration",
      managementFunction
    );

    const httpApi = new HttpApi(this, "Rides-Management-Http-Api");
    httpApi.addRoutes({
      path: "/submit/rides/create",
      methods: [HttpMethod.POST],
      integration: ridesIntegration,
    });
  }
}
