# Release Guide

## Simple Version Management

This project uses manual version management. No automation, no complexity.

### When to Update Versions

Update versions when you:
- Fix important bugs
- Add new features
- Make breaking changes

### How to Update Versions

1. Update package.json files manually:
   ```bash
   # Root package.json
   # packages/core/package.json
   # packages/ui/package.json
   # apps/admin/package.json
   # apps/platform/package.json
   ```

2. Update Python API version:
   ```bash
   # Edit apps/api/pyproject.toml
   version = "0.1.0"  # Update this
   ```

3. Commit and tag:
   ```bash
   git add .
   git commit -m "chore: bump version to 0.1.0"
   git tag v0.1.0
   git push origin main --tags
   ```

4. Create GitHub release (optional):
   - Go to GitHub → Releases → "Create a new release"
   - Choose the tag you just pushed
   - Add release notes
   - Publish release

### Version Format

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **Patch** (0.1.0 → 0.1.1): Bug fixes, minor improvements
- **Minor** (0.1.0 → 0.2.0): New features, performance improvements
- **Major** (0.1.0 → 1.0.0): Breaking changes

### Current Version

Check current version in any package.json file:
```bash
node -p "require('./package.json').version"
```
