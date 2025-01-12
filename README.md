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

2. `app.json` dosyasını düzenleyin:
   - iOS için `bundleIdentifier`
   - Android için `package` değerlerini kendi uygulamanızın kimliği ile değiştirin

3. `App.js` dosyasında backend URL'sini düzenleyin:
   - Apple Sign In için: `http://localhost:5040/Nexus/Api/User/AppleTokenValidate`
   - Google Sign In için: `[GOOGLE_TOKEN_VALIDATE_ENDPOINT]`
   adreslerini kendi backend servisinizin adresleri ile değiştirin

4. Development build oluşturun:
```bash
npx expo prebuild
```

5. Uygulamayı çalıştırın:
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
(Google Sign In entegrasyonu eklenecek)

## Not
- Expo Go ile test edilemez, development build gereklidir
- Backend servisinin token doğrulama mantığını içermesi gerekir
- Her iki sign-in yöntemi de hem iOS hem de Android platformlarında kullanılabilir 