# Contributing to MFX Starter

Thank you for your interest in contributing to MFX Starter! This document provides guidelines and information about contributing to this project.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/mfx-starter.git
   cd mfx-starter
   ```

3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/lyubomir-bozhinov/mfx-starter.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development environment:
   ```bash
   npm run start:all
   ```

## 📋 Development Workflow

### Branch Naming Convention

- **Features**: `feature/description-of-feature`
- **Bug fixes**: `fix/description-of-fix`
- **Documentation**: `docs/description-of-change`
- **Chores**: `chore/description-of-task`

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the coding standards
3. Add tests for your changes
4. Run the test suite:
   ```bash
   npm run test:all
   ```

5. Run linting and formatting:
   ```bash
   npm run lint:all
   npm run format:all
   ```

6. Commit your changes:
   ```bash
   git commit -m "feat: add amazing new feature"
   ```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```
feat(auth): add JWT token refresh mechanism
fix(ui): resolve button styling issue in dark mode
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test:all

# Run tests for specific workspace
npm run test -w mf_host
npm run test -w mf_provider_angular
npm run test -w mf_provider_svelte

# Run E2E tests
npm run e2e

# Run E2E tests in interactive mode
npm run cy:open
```

### Writing Tests

- **Unit Tests**: Place unit tests next to the component/function being tested
- **Integration Tests**: Use the `__tests__` directory in each workspace
- **E2E Tests**: Add E2E tests in the `cypress/e2e` directory

### Test Coverage

We aim for at least 80% test coverage. Run coverage reports:

```bash
npm run test:coverage -w mf_host
```

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Follow the existing TypeScript configuration
- Use proper type annotations
- Avoid `any` type when possible

### React Guidelines

- Use functional components with hooks
- Follow the React hooks rules
- Use proper prop types
- Implement error boundaries for remote modules

### Angular Guidelines

- Follow Angular style guide
- Use reactive forms
- Implement proper lifecycle hooks
- Use Angular CLI for generating components

### Svelte Guidelines

- Use Svelte 4+ features
- Follow Svelte best practices
- Use proper reactive declarations
- Implement proper component lifecycle

### Styling

- **React/Svelte**: Use Tailwind CSS utility classes
- **Angular**: Use SCSS with BEM methodology
- Follow the existing design system
- Ensure responsive design

## 📝 Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex logic with inline comments
- Update README files when adding new features
- Include examples in documentation

### API Documentation

- Document all exposed module federation components
- Include prop types and interfaces
- Provide usage examples
- Document error scenarios

## 🔄 Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Update documentation if needed
3. Check that your code follows the style guidelines
4. Verify that your changes don't break existing functionality

### Submitting a Pull Request

1. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub
3. Fill out the PR template completely
4. Link any related issues
5. Request review from maintainers

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] E2E tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
```

## 🐛 Bug Reports

When filing bug reports, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node.js version, browser (if applicable)
6. **Screenshots**: If applicable

## 💡 Feature Requests

When requesting features:

1. **Description**: Clear description of the feature
2. **Use Case**: Why this feature would be useful
3. **Proposed Solution**: How you envision the feature working
4. **Alternatives**: Alternative solutions considered

## 🚢 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Schedule

- **Major releases**: Quarterly
- **Minor releases**: Monthly
- **Patch releases**: As needed

## 📞 Getting Help

If you need help:

1. Check the [documentation](README.md)
2. Search [existing issues](https://github.com/lyubomir-bozhinov/mfx-starter/issues)

Thank you for contributing to MFX Starter! 🎉
