# Compliance Checker Frontend

A React-based frontend application for checking text and document compliance against customizable rules and regulations.

## Features

- **Text Analyzer**: Analyze plain text for compliance issues
- **Document Analyzer**: Upload and analyze PDF, DOCX, and TXT files
- **Rules Manager**: Create, manage, and apply custom compliance rules
- **Results Panel**: View detailed analysis results and compliance violations
- **Statistics Dashboard**: Track compliance metrics and statistics

## Technology Stack

- **React 18**: UI framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript (ES6+)**: Scripting language

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd compliance-checker-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (optional):
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building

Build for production:

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── TextAnalyzer.jsx
│   ├── DocumentAnalyzer.jsx
│   ├── RulesManager.jsx
│   ├── ResultsPanel.jsx
│   └── StatsPanel.jsx
├── data/               # Application data
│   └── ruleTemplates.js
├── services/           # API services
│   └── api.js
├── App.jsx             # Main app component
├── main.jsx            # React entry point
└── index.css           # Global styles
```

## API Integration

The frontend communicates with a backend API at the configured endpoint (default: `http://localhost:5000/api`).

### Available API Endpoints

- `POST /analyze/text` - Analyze text content
- `POST /analyze/document` - Analyze uploaded documents
- `GET /rules` - Retrieve all compliance rules
- `POST /rules` - Create a new rule
- `PUT /rules/:id` - Update an existing rule
- `DELETE /rules/:id` - Delete a rule
- `GET /statistics` - Get compliance statistics

## Styling

This project uses Tailwind CSS for styling. Modify `tailwind.config.js` to customize the design system.

## Contributing

1. Create a new branch for your feature
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License.
