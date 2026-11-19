// The apmn theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in apmn.settings.json and the generated apmn.settings.ts;
// change them with `astryx experimental theme editor set apmn ...`. Add your own changes below: they win over the settings.
import {defineTheme} from '@astryxdesign/core/theme';
import {apmnSettings} from './apmn.settings';

export const apmnTheme = defineTheme({
  extends: apmnSettings,
  name: 'apmn',
});
