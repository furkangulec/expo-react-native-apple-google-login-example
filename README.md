# Apple Sign In Test - Expo

Bu proje, Expo React Native kullanarak Apple Sign In özelliğini test etmek için oluşturulmuştur.

## Özellikler

- Apple Sign In entegrasyonu
- Token ve yetkilendirme kodu doğrulama
- Kullanıcı adı ve email bilgilerini alma (kullanıcı izin verirse)

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. `app.json` dosyasını düzenleyin:
   - iOS için `bundleIdentifier`
   - Android için `package` değerlerini kendi uygulamanızın kimliği ile değiştirin

3. `App.js` dosyasında backend URL'sini düzenleyin:
   - `http://localhost:5040/Nexus/Api/User/AppleTokenValidate` adresini kendi backend servisinizin adresi ile değiştirin

4. Development build oluşturun:
```bash
npx expo prebuild
```

5. iOS için uygulamayı çalıştırın:
```bash
npx expo run:ios
```

## Backend Entegrasyonu

Backend servisiniz aşağıdaki formatta bir POST isteği almalıdır:

```json
{
  "identityToken": "string",
  "authorizationCode": "string",
  "appleName": "string" // Opsiyonel
}
```

## Not
- Apple Sign In özelliği yalnızca iOS ve Android cihazlarda çalışır
- Expo Go ile test edilemez, development build gereklidir
- Backend servisinin Apple token doğrulama mantığını içermesi gerekir 