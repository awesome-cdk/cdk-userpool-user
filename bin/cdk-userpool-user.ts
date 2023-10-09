#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib/core';
import { ExampleUserPoolUserStack } from '../lib/example-user-pool-user-stack';

const app = new cdk.App();
new ExampleUserPoolUserStack(app, 'ExampleUserPoolUserStack', {});
