# CLEAN CITY WATCH (CCW)

## Project Overview

The Clean City Watch project is an innovative solution to address the critical issue of illegal garbage dumping in urban areas. Our user-friendly mobile application empowers citizens to report and resolve instances of garbage dumping, leading to improved environmental impact, public health, and the overall quality of life in cities.

### Key Features

- **Garbage Dumping Reporting:** Users can easily report incidents of illegal garbage dumping by capturing and submitting information through the app.
  
- **Optimized Cleanup:** The data collected is used to optimize cleanup efforts, ensuring efficient allocation of resources.

- **Community Collaboration:** We foster collaboration between communities and local authorities to tackle garbage dumping collectively.

## Project Update

With the increasing challenges posed by improper waste disposal, the Clean City Watch app continues to make strides in achieving its mission. Here are some recent updates:

- **New Reporting Features:** We've added new reporting features to make it even easier for users to document and report garbage dumping incidents.

- **Data Analytics:** We now provide data analytics and insights to local authorities, helping them make informed decisions for waste management.

- **Community Engagement:** Our community engagement initiatives have seen increased participation, with more citizens joining the cause.

Our mission is to create cleaner, more sustainable cities by engaging citizens in the effort to combat garbage dumping. By utilizing modern technology, effective communication, and data accessibility, we aim to bridge the gap between residents and authorities, ultimately contributing to the improvement of urban environments.


## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

## Prerequisites

- Install PostgreSQL on your system.
- Create a PostgreSQL database named `ccw`.
- Make sure you have a username and password with appropriate permissions for the `ccw` database.

- Install Node.js from the [official website](https://nodejs.org/).


## Installation

Follow these steps to set up and run the Flutter application:

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/clean-city-watch/ccw-server.git
    ```

2. **Navigate to the Project Directory:**

    ```bash
    cd ccw-server
    ```

3. **Install project dependencies ccw-server:**

    ```bash
    npm install
    ```

4. **Inside the libs/prisma-schema directory, locate the schema.prisma file.**

    Run the Prisma migration to create the database schema:

    ```bash
    npx prisma migrate dev
    ```

5. **Apply the seed data to the ccw database to populate initial data:**

    ```bash
    # Replace 'username' and 'password' with your PostgreSQL credentials
    psql -U username -d ccw -a -f seed.sql
    ```

6. **Running the Backend**
    Start the development server:

    ```bash
    npx nx serve ccw-server
    npx nx serve ccw-admin
    ```

    The backend server should now be running on a local port (e.g., http://localhost:3000).

    The frontend admin server should now be running on a local port (e.g., http://localhost:4200).



## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators).

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).

## Want better Editor Integration?

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.



## Contributing

We welcome contributions from the community and appreciate your interest in improving this project. To contribute, please follow these guidelines:

1. **Fork the Repository:** Click the "Fork" button at the top right of the repository to create your copy.

2. **Clone Your Fork:** Clone your forked repository to your local machine.

    ```bash
    git clone https://github.com/yourusername/your-forked-repo.git
    cd your-forked-repo
    ```

3. **Create a New Branch:** Create a new branch for your contribution.

    ```bash
    git checkout -b feature/your-feature
    ```

4. **Make Changes:** Make your desired changes or additions to the codebase. Ensure your code follows the project's coding standards.

5. **Commit Changes:** Commit your changes with a clear and concise commit message.

    ```bash
    git commit -m "Add your descriptive commit message here"
    ```

6. **Push to Your Fork:** Push your changes to your forked repository on GitHub.

    ```bash
    git push origin feature/your-feature
    ```

7. **Open a Pull Request:** Go to the original repository on GitHub and click the "New Pull Request" button. Provide a descriptive title and detailed explanation of your changes.

8. **Review and Collaborate:** Collaborate with the maintainers and address any feedback or comments on your pull request. Your contribution will be reviewed and merged once it meets the project's standards.

By contributing to this project, you agree to abide by the [Code of Conduct](link-to-code-of-conduct), so please ensure you are familiar with it.

Thank you for helping improve this project! We appreciate your contributions.

https://drive.google.com/drive/folders/1Tc8xtr04Z1cSgFKxDsrDtNbu0RhYNwsf?usp=sharing

## License

Specify the license your project uses. Common licenses include MIT, Apache License, GPL, etc.


