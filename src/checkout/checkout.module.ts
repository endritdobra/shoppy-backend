import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    {
      provide: Stripe,
      useFactory: (configService: ConfigService) => {
        new Stripe(configService.getOrThrow<string>('STRIPE_SECRET_KEY'));
      },
      inject: [ConfigService],
    },
  ],
})
export class CheckoutModule {}
