import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { SqsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class SubmitRideCompletionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const topic = new Topic(this, "Rides-Management-Topic");

    const queue = new Queue(this, "Test-Queue");

    topic.addSubscription(new SqsSubscription(queue));

    const lambda = new NodejsFunction(this, "Rides-Processor", {
      runtime: Runtime.NODEJS_18_X,
      entry: "./functions/rides-processor.ts",
      bundling: {
        minify: true,
        sourceMap: true,
      },
      environment: {
        SNS_TOPIC_ARN: topic.topicArn,
      },
    });

    topic.grantPublish(lambda);

    const lambdaIntegration = new HttpLambdaIntegration(
      "Rides-Management-Integration",
      lambda
    );

    const httpApi = new HttpApi(this, "Rides-Management-Http-Api");
    httpApi.addRoutes({
      path: "/submit/ride/create",
      methods: [HttpMethod.POST],
      integration: lambdaIntegration,
    });
  }
}
