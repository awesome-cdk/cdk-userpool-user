import {Construct} from "@aws-cdk/core";
import {CfnUserPoolUserToGroupAttachment, IUserPool} from "@aws-cdk/aws-cognito";
import {AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId} from "@aws-cdk/custom-resources";

export class UserPoolUser extends Construct {

    constructor(scope: Construct, id: string, props: {
        userPool: IUserPool,
        username: string,
        password: string,
        groupName: string,
    }) {
        super(scope, id);

        const ADMIN_USERNAME = props.username;
        const ADMIN_PASSWORD = props.password;

        // Create the user inside the Cognito user pool using Lambda backed AWS Custom resource
        const firstAdminCognitoUser = new AwsCustomResource(this, 'AwsCustomResource-CreateUser', {
            onCreate: {
                service: 'CognitoIdentityServiceProvider',
                action: 'adminCreateUser',
                parameters: {
                    UserPoolId: props.userPool.userPoolId,
                    Username: ADMIN_USERNAME,
                    MessageAction: 'SUPPRESS',
                    TemporaryPassword: ADMIN_PASSWORD,
                },
                physicalResourceId: PhysicalResourceId.of(`AwsCustomResource-CreateUser-${ADMIN_USERNAME}`),
            },
            onDelete: {
                service: "CognitoIdentityServiceProvider",
                action: "adminDeleteUser",
                parameters: {
                    UserPoolId: props.userPool.userPoolId,
                    Username: ADMIN_USERNAME,
                },
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
        });

        // Force the password for the user, because by default when new users are created
        // they are in FORCE_PASSWORD_CHANGE status. The newly created user has no way to change it though
        const forceAdminPassword = new AwsCustomResource(firstAdminCognitoUser, 'AwsCustomResource-ForcePassword', {
            onCreate: {
                service: 'CognitoIdentityServiceProvider',
                action: 'adminSetUserPassword',
                parameters: {
                    UserPoolId: props.userPool.userPoolId,
                    Username: ADMIN_USERNAME,
                    Permanent: true,
                    Password: ADMIN_PASSWORD,
                },
                physicalResourceId: PhysicalResourceId.of(`AwsCustomResource-ForcePassword-${ADMIN_USERNAME}`),
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
        });

        if (props.groupName) {
            const userToAdminsGroupAttachment = new CfnUserPoolUserToGroupAttachment(this, 'AttachAdminToAdminsGroup', {
                userPoolId: props.userPool.userPoolId,
                groupName: props.groupName,
                username: ADMIN_USERNAME,
            });
            userToAdminsGroupAttachment.node.addDependency(firstAdminCognitoUser);
            userToAdminsGroupAttachment.node.addDependency(forceAdminPassword);
            userToAdminsGroupAttachment.node.addDependency(props.userPool);
        }
    }
}
