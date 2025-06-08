import { AuthStackParamList } from './AuthNavigator';
import { TabParamList } from './TabNavigator';

export type RootStackParamList = {
  Auth: AuthStackParamList;
  Main: TabParamList;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
