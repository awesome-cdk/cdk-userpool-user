# Create users inside a Cognito UserPool using AWS CDK

### Usage

```typescript
const userPool = new UserPool(this, 'UserPool');

new UserPoolUser(this, 'Tina', {
    userPool,
    username: 'tina_2021',
    password: 'Passw0$rd',
});
```

If you want to create the user within the UserPool and add him to a Cognito user group:

```typescript
 new UserPoolUser(this, 'John', {
    userPool,
    username: 'john123',
    password: 'Passw0$rd',
    groupName: 'admins', // group name here
});
```
