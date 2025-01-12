# Apple ve Google Sign In - Expo Örnek Proje

Bu proje, Expo React Native kullanarak Apple Sign In ve Google Sign In özelliklerini test etmek için oluşturulmuştur.

## Özellikler

- Apple Sign In entegrasyonu
- Google Sign In entegrasyonu
- Token ve yetkilendirme kodu doğrulama
- Kullanıcı bilgilerini alma (email, isim)

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun:
   - `.env.example` dosyasını `.env` olarak kopyalayın
   - Google Cloud Console'dan aldığınız client ID'leri `.env` dosyasına ekleyin:
     ```
     GOOGLE_WEB_CLIENT_ID=your_web_client_id_here
     GOOGLE_IOS_CLIENT_ID=your_ios_client_id_here
     ```

3. `app.json` dosyasını düzenleyin:
   - iOS için `bundleIdentifier`
   - Android için `package` değerlerini kendi uygulamanızın kimliği ile değiştirin

4. Google Cloud Console'dan gerekli yapılandırmayı yapın:
   - Yeni bir proje oluşturun
   - OAuth 2.0 client ID'leri oluşturun:
     - iOS için: Bundle ID'nizi authorized bundle ID olarak ekleyin
     - Android için: Package name ve SHA-1 sertifika parmak izini ekleyin
     - Web için: Authorized redirect URI'leri ekleyin
   - `google-services.json` dosyasını indirip proje ana dizinine yerleştirin

5. `App.js` dosyasında backend URL'lerini düzenleyin:
   - Apple Sign In için: `http://localhost:5040/Nexus/Api/User/AppleTokenValidate`
   - Google Sign In için: `YOUR_GOOGLE_VALIDATION_ENDPOINT`
   adreslerini kendi backend servisinizin adresleri ile değiştirin

6. Development build oluşturun:
```bash
npx expo prebuild
```

7. Uygulamayı çalıştırın:
   - iOS için:
   ```bash
   npx expo run:ios
   ```
   - Android için:
   ```bash
   npx expo run:android
   ```

## Backend Entegrasyonu

### Apple Sign In
Backend servisiniz aşağıdaki formatta bir POST isteği almalıdır:

```json
{
  "identityToken": "string",
  "authorizationCode": "string",
  "appleName": "string" // Opsiyonel
}
```

### Google Sign In
Backend servisiniz aşağıdaki formatta bir POST isteği almalıdır:

```json
{
  "idToken": "string",
  "user": {
    "email": "string",
    "name": "string"
  }
}
```

## Google Sign In Notları
- Native Google Sign In SDK'sı kullanıldığı için özel bir callback URL tanımlamaya gerek yoktur
- Google Cloud Console'da bundle ID ve package name'in doğru yapılandırıldığından emin olun
- Android için SHA-1 sertifika parmak izi gereklidir
- Web client ID, iOS client ID ve Android yapılandırması birbirinden farklıdır

## Güvenlik Notları
- `.env` dosyası ve `google-services.json` dosyası git reposuna eklenmemelidir
- Bu dosyalar hassas bilgiler içerdiği için güvenli bir şekilde saklanmalıdır
- Örnek değerler için `.env.example` dosyasını referans alın

## Not
- Expo Go ile test edilemez, development build gereklidir
- Backend servisinin token doğrulama mantığını içermesi gerekir
- Her iki sign-in yöntemi de hem iOS hem de Android platformlarında kullanılabilir 