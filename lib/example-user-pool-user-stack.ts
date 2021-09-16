import * as cdk from '@aws-cdk/core';
import {CfnUserPoolGroup, UserPool} from "@aws-cdk/aws-cognito";
import {UserPoolUser} from "./UserPoolUser";

export class ExampleUserPoolUserStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const userPool = new UserPool(this, 'UserPool');

        const adminsGroup = new CfnUserPoolGroup(this, 'Admins', {
            groupName: 'Admins',
            userPoolId: userPool.userPoolId,
        })

        new UserPoolUser(this, 'John', {
            userPool,
            username: 'john123',
            password: 'Passw0$rd',
            groupName: adminsGroup.groupName as string,
        });
    }
}
