# VinoBuzz Mobile Prototype (Expo + React Native)

Prototype mobile theo đề **VinoBuzz Senior Mobile Developer Assessment**.

## Mục tiêu đã hoàn thành

- Task 1: Chatbox dạng FAB + overlay (hidden/minimized/expanded), có mock message, typing indicator, quick replies, và action **View product**.
- Task 2: Product Detail có gallery swipe ngang, loading skeleton, content stack, expandable tasting notes, sticky CTA Add to Cart.
- Task 3: React Navigation flow `Home -> Product Detail`, deep link `vinobuzz://product/:id` (kèm fallback `vinobuzz://:id`), offline banner + mock toggle.

## Stack

- Expo SDK 54
- React Native + TypeScript
- React Navigation (native stack)
- NetInfo cho trạng thái mạng
- Mock data local (không gọi API)

## Chạy project

### 1. Cài dependencies

```bash
npm install
```

### 2. Start Metro

```bash
npm run start
```

### 3. Chạy app

```bash
npm run ios
# hoặc
npm run android
# hoặc
npm run web
```

## Test deep link

Ví dụ mở thẳng product `123`:

```bash
npx uri-scheme open vinobuzz://product/123 --ios
```

Android:

```bash
npx uri-scheme open vinobuzz://product/123 --android
```

## Assumptions

- Product và chat data là mock local theo domain context của vinobuzz.ai.
- Màu sắc và bố cục mobile lấy cảm hứng từ screenshot web đã cung cấp, ưu tiên UX mobile hơn pixel-perfect web.
- Chat được render global trên app để giữ trạng thái overlay xuyên màn hình.

## Implementation notes

- Chat overlay đặt ở `RootNavigator` để đáp ứng yêu cầu “persistent overlay-style chat” khi navigate giữa các screen.
- Product Detail dùng `FlatList` paging cho gallery swipe và `sticky` bottom CTA kết hợp safe-area để hiển thị ổn trên iPhone có home indicator.
- Offline dùng cả NetInfo listener và mock toggle để dễ demo trong điều kiện online.

## Cấu trúc chính

- `src/navigation/`: stack navigator + linking config
- `src/screens/`: Home và Product Detail
- `src/components/`: chat overlay, offline banner, product card, skeleton, typing indicator
- `src/data/`: mock chat + product data
- `assets/images/`: ảnh nền và ảnh product

