import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// Token for axios instance injection
export const AXIOS_INSTANCE_TOKEN = 'AXIOS_INSTANCE_TOKEN';

export default {
  provide: AXIOS_INSTANCE_TOKEN,
  useFactory: (configService: ConfigService) => {
    const baseUrl = configService.get<string>('eurocamp.baseUrl');
    const timeout = configService.get<number>('eurocamp.timeout');

    return axios.create({
      baseURL: baseUrl,
      timeout: timeout,
      headers: { 'Content-Type': 'application/json' },
    });
  },
  inject: [ConfigService],

} as Provider