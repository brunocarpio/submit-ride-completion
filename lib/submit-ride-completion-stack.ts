import { Stack, StackProps } from "aws-cdk-lib";
import { AwsIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Topic } from "aws-cdk-lib/aws-sns";
import { SqsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class SubmitRideCompletionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const topic = new Topic(this, "Rides-Management-Topic");

    const queue = new Queue(this, "Test-Queue");

    topic.addSubscription(new SqsSubscription(queue));

    const api = new RestApi(this, "Rides-Management-Rest-Api");

    const resource = api.root
      .addResource("submit")
      .addResource("ride")
      .addResource("create");

    const role = new Role(this, "Rides-Management-Api-Integration-Role", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    });

    role.addToPolicy(
      new PolicyStatement({
        actions: ["sns:Publish"],
        resources: [topic.topicArn],
      })
    );

    const integration = new AwsIntegration({
      service: "sns",
      action: "publish",
      options: {
        credentialsRole: role,
        requestTemplates: {
          "application/json": JSON.stringify({
            TopicArn: topic.topicArn,
            Message: "$util.escapeJavaScript($input.body)",
          }),
        },
      },
    });

    resource.addMethod("POST", integration);
  }
}
