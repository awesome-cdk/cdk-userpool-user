import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib/core';
import * as CdkUserpoolUser from '../lib/example-user-pool-user-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkUserpoolUser.ExampleUserPoolUserStack(app, 'MyTestStack');
    // THEN
    const template = Template.fromStack(stack)
    template.templateMatches({
      "Resources": {}
    })
});
