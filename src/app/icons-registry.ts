import { addIcons } from 'ionicons';
import {
  close,
  addCircleOutline,
  removeCircleOutline,
  homeOutline,
  home,
  statsChartOutline,
  statsChart,
  walletOutline,
  wallet,
  menuOutline,
  menu,
  addOutline,
  add,
  calendarOutline,
  cashOutline,
  cardOutline,
  flagOutline,
  trash,
  create,
} from 'ionicons/icons';

/**
 * Registruje všetky ikony použité v aplikácii
 * Toto je centrálny bod pre registráciu ikon
 */
export function registerIcons() {
  addIcons({
    close: close,
    'add-circle-outline': addCircleOutline,
    'remove-circle-outline': removeCircleOutline,
    'home-outline': homeOutline,
    home: home,
    'stats-chart-outline': statsChartOutline,
    'stats-chart': statsChart,
    'wallet-outline': walletOutline,
    wallet: wallet,
    'menu-outline': menuOutline,
    menu: menu,
    'add-outline': addOutline,
    add: add,
    'calendar-outline': calendarOutline,
    'cash-outline': cashOutline,
    'card-outline': cardOutline,
    'flag-outline': flagOutline,
    trash: trash,
    create: create,
  });
}
