# Provisioning Cognito users using AWS CDK

Easily add/create users inside a Cognito UserPool during infrastructure provisioning using AWS CDK.

The most common use case is for provisioning the "first admin" within your platform, who can later create other admins
using UI. Another use case is if your application is for private use and you don't want to invest time in implementing a
full user registration UI.

### Usage

```typescript
const userPool = new UserPool(this, 'UserPool');

new UserPoolUser(this, 'Tina', {
    userPool,
    username: 'tina_2021',
    password: 'Passw0$rd',
});
```

If you want to create the user within the UserPool and add them to a Cognito user group:

```typescript
 new UserPoolUser(this, 'John', {
    userPool,
    username: 'john123',
    password: 'Passw0$rd',
    groupName: 'admins', // group name here
});
```
