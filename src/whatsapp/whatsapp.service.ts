import { Injectable } from '@nestjs/common';
import { CreateWhatsappDto } from './dto/create-whatsapp.dto';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from '@whiskeysockets/baileys';
import { text } from 'stream/consumers';

@Injectable()
export class WhatsappService {
  private sock;

  async onApplicationBootstrap() {
    console.log('Running connectedWhatsapp automatically on server start...');
    await this.connectWhatsapp();
  }

  async connectWhatsapp() {
    console.log('hello');

    try {
      const { state, saveCreds } =
        await useMultiFileAuthState('auth_info_baileys');
      if (state) {
        console.log('Using Saved Credential for authentication.');
        return this.initializeWhatsapp(state, saveCreds);
      } else {
        console.log('No saved Credential Found. Please scan QR Code.');
        return this.initializeWhatsapp(undefined, saveCreds);
      }
    } catch (error) {
      return error.message;
    }
    // this.sock = makeWASocket({
    //   auth: state,
    //   printQRInTerminal: true,
    // });

    // this.sock.ev.on('connection.update', (update) => {
    //   const { connection, lastDisconnect } = update;
    //   if (connection === 'close') {
    //     const shouldReconnect =
    //       lastDisconnect.error?.output?.statusCode !==
    //       DisconnectReason.loggedOut;
    //     console.log(
    //       'connection closed due to ',
    //       lastDisconnect.error,
    //       ', reconnecting ',
    //       shouldReconnect,
    //     );
    //     // Reconnect jika tidak logout
    //     if (shouldReconnect) {
    //       // this.connectWhatsApp();
    //     }
    //   } else if (connection === 'open') {
    //     console.log('opened connection');
    //   }
    // });
  }

  private async initializeWhatsapp(authstate?: any, saveCreds?: Function) {
    try {
      const socketConfig: any = {
        printQRInTerminal: true,
      };
      // this.sock = makeWASocket({
      //   auth: authstate,
      //   printQRInTerminal: true,
      // });
      if (authstate) {
        socketConfig.auth = authstate;
      }
      this.sock = makeWASocket(socketConfig);

      this.sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') console.log(connection === 'open');
        if (connection === 'close') {
          const shouldReconnect =
            lastDisconnect.error?.output?.statusCode !==
            DisconnectReason.loggedOut;
          console.log(
            'connection closed due to ',
            lastDisconnect.error,
            ', reconnecting ',
            shouldReconnect,
          );
          // Reconnect jika tidak logout
          if (shouldReconnect) {
            if (saveCreds) {
              await saveCreds(this.sock.authstate);
            }

            this.initializeWhatsapp(authstate);
          }
        } else if (connection === 'open') {
          console.log('opened connection');
          // console.log(update);
          // this.sock.status == 'open';
          // console.log(authstate);
          // await this.sock.sendMessage('6281344635083@s.whatsapp.net', {
          //   text: 'test',
          // });
        }
      });

      return {
        message: 'Whatsapp Already to Used',
      };
    } catch (error) {
      return error.message;
    }
  }

  async sendMsg(createMessageDto: CreateWhatsappDto) {
    console.log(createMessageDto.message);
    try {
      await this.sock.sendMessage(`${createMessageDto.id}@s.whatsapp.net`, {
        text: createMessageDto.message,
      });

      return {
        message: 'pesan berhasil Dikirim',
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'pesan gagal dikirim',
        error: error.message,
      };
    }
  }
}
