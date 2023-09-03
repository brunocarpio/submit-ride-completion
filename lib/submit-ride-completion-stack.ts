import { Stack, StackProps } from "aws-cdk-lib";
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
  }
}
