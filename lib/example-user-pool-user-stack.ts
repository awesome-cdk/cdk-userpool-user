import * as cdk from '@aws-cdk/core';
import {RemovalPolicy} from '@aws-cdk/core';
import {CfnUserPoolGroup, UserPool} from "@aws-cdk/aws-cognito";
import {UserPoolUser} from "./UserPoolUser";

export class ExampleUserPoolUserStack extends cdk.Stack {
    private readonly userPool: UserPool;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.userPool = new UserPool(this, 'UserPool', {
            removalPolicy: RemovalPolicy.DESTROY,
        });

        this.createUser();
        this.createUserAndAddToGroup();
    }

    private createUserAndAddToGroup() {
        const adminsGroup = new CfnUserPoolGroup(this, 'Admins', {
            groupName: 'Admins',
            userPoolId: this.userPool.userPoolId,
        });

        new UserPoolUser(this, 'John', {
            userPool: this.userPool,
            username: 'john123',
            password: 'Passw0$rd',
            groupName: adminsGroup.groupName as string,
        });
    }

    private createUser() {
        new UserPoolUser(this, 'Tina', {
            userPool: this.userPool,
            username: 'tina_2021',
            password: 'Passw0$rd',
        });
    }
}
