# Publishing Guide for @Shanzy3/react-native-ui-datepicker

## Pre-Publishing Checklist

- [x] Package name changed to `@Shanzy3/react-native-ui-datepicker`
- [x] Version updated to `3.2.0`
- [x] Repository URLs updated
- [x] README updated with new features
- [ ] All tests passing
- [ ] Build successful
- [ ] NPM account ready

## Step-by-Step Publishing Instructions

### Step 1: Verify NPM Account

Make sure you're logged into NPM:

```bash
npm whoami
```

If not logged in, run:

```bash
npm login
```

Enter:

- Username: `ericboles` (or your NPM username)
- Password: (your NPM password)
- Email: (your email)
- One-time password: (if 2FA is enabled)

### Step 2: Run Tests

Ensure everything works:

```bash
npm run test
npm run typecheck
npm run lint
```

Fix any errors before proceeding.

### Step 3: Build the Package

This compiles TypeScript and creates the `lib` folder:

```bash
npm run prepack
```

This should create:

- `lib/commonjs/` - CommonJS build
- `lib/module/` - ES modules build
- `lib/typescript/` - TypeScript definitions

### Step 4: Test the Package Locally (Optional but Recommended)

Create a tarball to test:

```bash
npm pack
```

This creates a file like `ericboles-react-native-ui-datepicker-3.2.0.tgz`.

Test it in another project:

```bash
cd /path/to/test-project
npm install /path/to/ericboles-react-native-ui-datepicker-3.2.0.tgz
```

### Step 5: Publish to NPM

When you're ready to publish:

```bash
npm publish --access public
```

The `--access public` flag is **required** for scoped packages like `@Shanzy3/...`.

You should see output like:

```
npm notice
npm notice 📦  @Shanzy3/react-native-ui-datepicker@3.2.0
npm notice === Tarball Contents ===
npm notice 1.2kB   LICENSE
npm notice 10.5kB  README.md
npm notice 2.3kB   package.json
npm notice ...
npm notice === Tarball Details ===
npm notice name:          @Shanzy3/react-native-ui-datepicker
npm notice version:       3.2.0
npm notice filename:      ericboles-react-native-ui-datepicker-3.2.0.tgz
npm notice package size:  XX.X kB
npm notice unpacked size: XXX.X kB
npm notice shasum:        ...
npm notice integrity:     ...
npm notice total files:   XXX
npm notice
npm notice Publishing to https://registry.npmjs.org/ with tag latest
+ @Shanzy3/react-native-ui-datepicker@3.2.0
```

### Step 6: Verify Publication

Check that it's live:

```bash
npm view @Shanzy3/react-native-ui-datepicker
```

Visit your package page:
https://www.npmjs.com/package/@Shanzy3/react-native-ui-datepicker

### Step 7: Tag the Release on GitHub

Create a git tag for this release:

```bash
git tag -a v3.2.0 -m "Release v3.2.0 - Add minuteInterval, yearPickerOnly, and view toggle features"
git push origin v3.2.0
```

Create a GitHub release:

1. Go to https://github.com/ericboles/react-native-ui-datepicker/releases
2. Click "Create a new release"
3. Select tag `v3.2.0`
4. Title: `v3.2.0 - Enhanced Fork with Minute Intervals and Year Picker`
5. Description:

   ```markdown
   ## New Features

   - ⏰ Minute Interval Support - Control time picker intervals (1-30 minutes)
   - 📅 Year-Only Picker - Dedicated year picker returning integer values
   - 🎨 View Toggle Header - Optional header with date/time toggle buttons
   - 🌓 Enhanced Dark Mode Support

   ## Installation

   \`\`\`bash
   npm install @Shanzy3/react-native-ui-datepicker
   \`\`\`

   See the [README](https://github.com/ericboles/react-native-ui-datepicker#readme) for usage examples.
   ```

## Future Updates

When you make changes and want to publish an update:

### For Bug Fixes (Patch):

```bash
npm version patch  # 3.2.0 -> 3.2.1
npm run prepack
npm publish --access public
git push && git push --tags
```

### For New Features (Minor):

```bash
npm version minor  # 3.2.0 -> 3.3.0
npm run prepack
npm publish --access public
git push && git push --tags
```

### For Breaking Changes (Major):

```bash
npm version major  # 3.2.0 -> 4.0.0
npm run prepack
npm publish --access public
git push && git push --tags
```

## Troubleshooting

### Error: "You do not have permission to publish"

- Make sure you're logged in: `npm whoami`
- Verify the package name is unique or scoped to your username

### Error: "npm ERR! 403 Forbidden"

- Check that you used `--access public` flag
- Verify your NPM account email is verified

### Error: "npm ERR! code ENEEDAUTH"

- Run `npm login` again
- Check your credentials

### Build Errors

- Delete `node_modules` and `lib` folders
- Run `npm install` again
- Run `npm run prepack` again

## Post-Publication

After publishing, update your projects to use the new package:

```bash
npm uninstall react-native-ui-datepicker
npm install @Shanzy3/react-native-ui-datepicker
```

Update imports:

```typescript
// Old
import DateTimePicker from 'react-native-ui-datepicker';

// New
import DateTimePicker from '@Shanzy3/react-native-ui-datepicker';
```

## Support

If you encounter issues:

1. Check the [NPM docs](https://docs.npmjs.com/cli/v8/commands/npm-publish)
2. Open an issue on [GitHub](https://github.com/ericboles/react-native-ui-datepicker/issues)
3. Verify the package is working: https://runkit.com/npm/@Shanzy3/react-native-ui-datepicker
