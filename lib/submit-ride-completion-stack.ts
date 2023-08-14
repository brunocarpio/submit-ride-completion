import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class SubmitRideCompletionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const managementFunction = new lambda.Function(this, 'rides-management-function', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'rides-management-function.handler',
      code: lambda.Code.fromAsset('functions')
    });

    const ridesIntegration = new HttpLambdaIntegration('rides-management-integration', managementFunction);

    const httpApi = new apigwv2.HttpApi(this, 'rides-management-http-api');
    httpApi.addRoutes({
      path: '/submit/rides/create',
      methods: [ apigwv2.HttpMethod.POST ],
      integration: ridesIntegration
    })
  }
}
