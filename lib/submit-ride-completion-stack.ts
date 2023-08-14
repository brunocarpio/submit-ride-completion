import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class SubmitRideCompletionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const managementFunction = new lambda.Function(this, 'Rides-Processor', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'rides-processor.handler',
      code: lambda.Code.fromAsset('functions')
    });

    const ridesIntegration = new HttpLambdaIntegration('Rides-Management-Integration', managementFunction);

    const httpApi = new apigwv2.HttpApi(this, 'Rides-Management-Http-Api');
    httpApi.addRoutes({
      path: '/submit/rides/create',
      methods: [ apigwv2.HttpMethod.POST ],
      integration: ridesIntegration
    })
  }
}
